import "./Button.css";
export default function ButtonCustom(props) {
  return (
    <button className="btn" onClick={props.onPress} type="button">
      {props.buttonName ? props.buttonName : "Buy"}
    </button>
  );
}
