import { SelectHTMLAttributes } from 'preact/compat';

import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	readonly selectOptions: string[];
}

export const Select = ({ selectOptions, className, ...props }: SelectProps) => (
	<select className={`select ${className}`} {...props}>
		{selectOptions.map(option => (
			<option
				key={option}
				value={option}
			>
				{option}
			</option>
		))}
	</select>
);