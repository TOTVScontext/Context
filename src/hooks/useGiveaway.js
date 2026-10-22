import { useReducer, useRef, useCallback, useMemo } from 'react'
import { GiveawayService, GiveawayApiError } from '../services/giveaway.service.js'

const ACTIONS = {
    SUBMIT_START: 'SUBMIT_START',
    SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
    SUBMIT_ERROR: 'SUBMIT_ERROR',
    RESET: 'RESET',
}

const initialState = {
    submitStatus: 'idle',
    error: null,
    entry: null,
}

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SUBMIT_START:
            return { ...state, submitStatus: 'loading', error: null }

        case ACTIONS.SUBMIT_SUCCESS:
            return { ...state, submitStatus: 'success', error: null, entry: action.payload }

        case ACTIONS.SUBMIT_ERROR:
            return { ...state, submitStatus: 'error', error: action.payload }

        case ACTIONS.RESET:
            return initialState

        default:
            return state
    }
}

function toErrorMessage(err, fallback) {
    if (err?.name === 'AbortError') return null
    if (err instanceof GiveawayApiError && err.status === 409) return err.message
    if (err instanceof GiveawayApiError && err.status === 422) return err.message
    return err?.message ?? fallback
}

export function useGiveaway() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const abortRef = useRef(null)

    const submit = useCallback(async (formData) => {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        dispatch({ type: ACTIONS.SUBMIT_START })

        try {
            const result = await GiveawayService.submit(formData, { signal: controller.signal })
            dispatch({ type: ACTIONS.SUBMIT_SUCCESS, payload: result })
            return result
        } catch (err) {
            const message = toErrorMessage(err, 'Falha ao registrar inscrição. Tente novamente.')
            if (message !== null) dispatch({ type: ACTIONS.SUBMIT_ERROR, payload: message })
        } finally {
            if (abortRef.current === controller) abortRef.current = null
        }
    }, [])

    const reset = useCallback(() => {
        abortRef.current?.abort()
        dispatch({ type: ACTIONS.RESET })
    }, [])

    return useMemo(() => ({
        submitStatus: state.submitStatus,
        error: state.error,
        entry: state.entry,
        isLoading: state.submitStatus === 'loading',
        isSuccess: state.submitStatus === 'success',
        isError: state.submitStatus === 'error',
        submit,
        reset,
    }), [state.submitStatus, state.error, state.entry, submit, reset])
}