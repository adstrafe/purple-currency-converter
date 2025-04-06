import { SelectHTMLAttributes } from 'preact/compat';

import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	readonly selectOptions: string[];
}

export const Select = ({ selectOptions, ...props }: SelectProps) => (
	<select {...props}>
		{selectOptions.map((option, i) => (
			<option
				key={i}
				value={option}
			>
				{option}
			</option>
		))}
	</select>
);