export default function FormInput({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  required = false,
  minLength,
  placeholder,
}) {
  return (
    <div className="relative border-b border-gray-300 focus-within:border-black transition-colors">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="peer block w-full border-0 bg-transparent py-2.5 text-gray-900 placeholder:text-transparent focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
        placeholder={placeholder || label}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-sm font-medium text-gray-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-900"
      >
        {label}
      </label>
    </div>
  );
}
