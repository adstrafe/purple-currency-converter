import { render } from 'preact';
import { Select } from './components/select/Select';
import { currencies } from './data/currencies';
import { debounce } from './utils/debounce';
import { useReducer } from 'preact/hooks';
import { REDUCER_ACTION_TYPE, initState, reducer } from './reducers/reducer';

import './style.css';

const API_ENDPOINT = 'http://0.0.0.0:8080';

export const App = () => {
	const [ state, dispatch ] = useReducer(reducer, initState);

	const handleConversion = debounce(async () => {
		dispatch({ type: REDUCER_ACTION_TYPE.START_LOADING });

		const form = document.getElementById('currency-form') as HTMLFormElement;
		const formData = new FormData(form);

		const amount = formData.get('currencyAmount');
		const baseCurrency = formData.get('currencyFrom');
		const conversionCurrency = formData.get('currencyTo');

		if (!amount || !baseCurrency || !conversionCurrency) {
			dispatch({
				type: REDUCER_ACTION_TYPE.SET_ERROR,
				payload: { error: 'Please fill out all fields.' }
			});
			return;
		}

		try {
			const response = await fetch(`${API_ENDPOINT}/convert`, {
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
			
			if (!response.ok) {
				const info = await response.json();
				throw new Error(`Conversion failed: ${JSON.stringify(info)}`);
			}

			const { result } = await response.json();
			dispatch({
				type: REDUCER_ACTION_TYPE.SET_RESULT,
				payload: {
					result: Math.round((result + Number.EPSILON) * 100) / 10,
					conversionCurrency: conversionCurrency.toString(),
					totalConversions: state.totalConversions
				}
			});
		}
		catch (err) {
			dispatch({
				type: REDUCER_ACTION_TYPE.SET_ERROR,
				payload: { error: 'Conversion failed... Please try again.' }
			});
			console.error(err);
		}
	}, 250);

	return (
		<div className='app-container'>
			<h1 className='heading'>
				Purple currency converter
			</h1>
			<div className='convert-container'>
				<form id='currency-form'>
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
							selectOptions={currencies}
							required
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='currencyTo'>To</label>
						<Select
							id='currencyTo'
							name='currencyTo'
							selectOptions={currencies}
							required
						/>
					</div>
				</form>
			</div>
			<button
				type='button'
				onClick={() => handleConversion()}
			>
				Convert currency
			</button>
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
		</div>
	);
}

render(<App />, document.getElementById('app'));
