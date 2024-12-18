import { useEffect, useState } from "react";

function CheckBox({ pemp_id, pskill_id, pselectedEmp, onSelectionChnge }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isChecked = pselectedEmp.some(
      (emp) => emp.employeeId === pemp_id && emp.skillId === pskill_id
    );
    setChecked(isChecked);
  }, [pselectedEmp, pemp_id, pskill_id]);

  const handleOnChange = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onSelectionChnge(pemp_id, pskill_id, newCheckedState);
  };

  return (
    <div className="checkboxs">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default CheckBox;
