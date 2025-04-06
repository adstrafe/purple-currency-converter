import { useRef } from 'preact/hooks';

import { Select } from '~/components/Select';
import { useCurrencies } from '~/components/hooks/useCurrencies';
import { useDebounce } from '~/hooks/useDebounce';
import { cancelEvent } from '~/utils/common';

import { useConversionFormState } from '../hooks/useConversionFormState';
import { useStatistics } from '../hooks/useStatistics';

import './ConversionForm.css';

export interface ConversionFormProps {
	readonly apiEndpoint: string;
}

export const ConversionForm = ({ apiEndpoint }: ConversionFormProps) => {
	const [ state, dispatch ] = useConversionFormState();
	const currencies = useCurrencies(apiEndpoint);
	const formRef = useRef<HTMLFormElement>(null);
	useStatistics(apiEndpoint, response => {
		dispatch({
			kind: 'set-conversions',
			totalConversions: response.totalConversions,
		});
	});

	const handleConversion = useDebounce(async (e: Event) => {
		cancelEvent(e);

		const form = formRef.current;
		if (!form) {
			return;
		}

		dispatch({ kind: 'start-loading' });

		const formData = new FormData(form);
		const amount = formData.get('currencyAmount') as string;
		const baseCurrency = formData.get('currencyFrom') as string;
		const conversionCurrency = formData.get('currencyTo') as string;

		try {
			const call = await fetch(`${apiEndpoint}/convert`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					amount: Number(amount),
					baseCurrency,
					conversionCurrency
				})
			});
			
			if (!call.ok) {
				throw new Error(`Conversion failed: ${await call.text()}`);
			}

			const { result } = await call.json();
			dispatch({
				kind: 'set-result',
				result: Math.round((result + Number.EPSILON) * 100) / 100,
				conversionCurrency,
			});
		}
		catch (err) {
			// TODO: show in UI
			console.error(err);
		}
	}, 250);

	return (
		<>
			<h1 className='heading'>
				Purple currency converter
			</h1>
			<form
				ref={formRef}
				className='convert-container'
				onSubmit={handleConversion}
			>
				<div className='convert-container__inputs'>
					<div className='form-input'>
						<label htmlFor='currencyAmount'>Amount to convert</label>
						<input
							type='number'
							id='currencyAmount'
							name='currencyAmount'
							min={1}
							defaultValue={200}
							required
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='currencyFrom'>From</label>
						<Select
							id='currencyFrom'
							name='currencyFrom'
							selectOptions={currencies.isFulfilled ? currencies.result.currencies : [ 'Loading...' ]}
							required
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='currencyTo'>To</label>
						<Select
							id='currencyTo'
							name='currencyTo'
							selectOptions={currencies.isFulfilled ? currencies.result.currencies : [ 'Loading...' ]}
							required
						/>
					</div>
				</div>
				<button type='submit'>
					Convert currency
				</button>
			</form>
			<div className='result-container'>
				<div className='result-container__item'>
					<p className='result-container__heading'>
						Result
					</p>
					<div className='result-container__result'>
						<p>
							{state.result}
						</p>
						<p>
							{state.conversionCurrency}
						</p>
					</div>
				</div>
				<div className='divider'></div>
				<div className='result-container__item'>
					<p className='result-container__heading'>
						Number of calculations made
					</p>
					<p className='result-container__result'>
						{state.totalConversions}
					</p>
				</div>
			</div>
		</>
	);
}
