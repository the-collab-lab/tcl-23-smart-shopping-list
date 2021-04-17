import { Redirect } from 'react-router-dom';

export default function List(props) {
  return (
    <>
      {props.token ? null : <Redirect to="/" />}
      <h1>THIS IS THE LIST</h1>
    </>
  );
}
