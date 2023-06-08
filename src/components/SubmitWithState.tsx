import { HTMLAttributes, useEffect, useState } from "react";

interface SubmitStateParams {
    state?: 'submit' | 'loading' | 'success' | 'error',
    value: string,
    className?: HTMLAttributes<HTMLInputElement>['className']
}

interface useSubmitWithStates {
    states: ('submit' | 'loading' | 'success' | 'error' | undefined)
}

interface useSubmitWithStateParams {
    defaultState?: useSubmitWithStates['states']
}

const useSubmitWithState = ({ defaultState = undefined }: useSubmitWithStateParams={}) => {
    const [formSubmitState, setFormSubmitState] = useState<useSubmitWithStates['states']>(defaultState);

    return {
        button: SubmitWithState,
        get: formSubmitState,
        set: setFormSubmitState,
    };
}

const SubmitWithState = ({ value, state, className }: SubmitStateParams) => {
    const [StateData, setStateData] = useState<{ className: HTMLAttributes<HTMLInputElement>['className'], message: string }>({
        className: 'bg-cyan-400',
        message: 'Loading...'
    })
    useEffect(() => {
        switch (state) {
            case 'error':
                setStateData({
                    className: 'bg-red-700',
                    message: 'Error'
                })
                break;
            case 'success':
                setStateData({
                    className: 'bg-green-600',
                    message: 'Success'
                })
                break;
            case 'submit':
            case 'loading':
            default:
                setStateData({
                    className: 'bg-cyan-400',
                    message: 'Loading...'
                })
                break;
        }
    }, [state])
    return (
        <div className="flex flex-col">
            <div
                className={`submitwithstate-error ${(!state) ? 'h-0 py-0' : 'py-2'} overflow-hidden font-bold text-white text-center ${StateData.className} `}
            >
                {StateData.message}
            </div>
            <input
                disabled={state == 'loading'}
                type="submit"
                value={value}
                className={`${className} ${(state == 'loading') ? 'cursor-not-allowed' : 'cursor-pointer'} pb-2 pt-2 font-bold rounded-b-xl hover:shadow-xl`}
            />

        </div>
    )
}
export { SubmitWithState, useSubmitWithState };