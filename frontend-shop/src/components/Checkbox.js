export const Checkbox = ({ label, value, onChange }) => {
    console.log(value)
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };