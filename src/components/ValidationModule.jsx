import { useState } from "react";

export const ValidationModule = ({
    label,
    name,
    value,
    onChange,
    required = true,
    minLength = 8,
    maxLength = 32,
    regex,
    errorMessage,
    type = "text",
    disabled = false
}) => {
    const [touched, SetTouched] = useState(false);
    const [error, SetError] = useState("");

    const validate = (val) => {
        if (required && !val) {
            return "Este campo es obligatorio.";
        }
        if (minLength && val.length < minLength) {
            return `Debe tener al menos ${minLength} caracteres.`;
        }
        if (maxLength && val.length > maxLength) {
            return `El campo no debe exceder ${maxLength} caracteres.`;
        }
        if (regex && !new RegExp(regex).test(val)) {
            return errorMessage;
        }
        return "";
    };

    const handleTouch = () => {
        SetTouched(true);
        SetError(validate(value));
    };

    const handleChange = (e) => {
        onChange(e);
        if (touched) {
            SetError(validate(e.target.value));
        }
    };

    return (
        <div className="mb-2">
            <div className="row justify-content-between">
                <label htmlFor={name} className="block font-medium mb-1 mt-3">
                    {label}
                </label>
                <input
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    type={type}
                    disabled={disabled}
                    onBlur={handleTouch}
                    className={`border p-2 w-full form-control rounded${error ? " border-red-500" : " border-gray-300"}`}
                />
                {error && (<p className="text-sm mt-1 text-danger" id="error-field">{error}</p>)}
            </div>
        </div>
    );
};