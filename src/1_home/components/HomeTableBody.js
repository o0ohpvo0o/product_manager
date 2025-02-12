import "./HomeTableBody.css";
const TableBody = (props) => {
  if (!props.body) return;

  return props.body.map((b) => (
    <tr key={b.duration}>
      <td>{b.duration}</td>
      <td>{b.amount}</td>
    </tr>
  ));
};

export default TableBody;
