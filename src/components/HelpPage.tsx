import React from 'react';
import { Link } from 'react-router-dom';
import {
  Modal,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Button
} from 'reactstrap';


export default class HelpPage extends React.Component {

  render() {
    return (
      <>
        <br /><br />
        <Container style={{border: 'groove', margin: 'auto', width: 1000, backgroundColor: 'lightgray'}}>
          <br />
          <div style={{float: 'right', marginRight: 20}}>
            <Link to={{
              pathname: '/USAC-budget/',
              search: '?d=2019&tab=keyword&'
            }}>
              <Button style={{backgroundColor: 'red', color: 'black', fontWeight: 'bold'}}>
                X
              </Button>
            </Link>
          </div>
          <br /><br /><br />
          <iframe width="960" height="600" style={{marginLeft: 20, marginRight: 20}} 
            src="https://www.youtube.com/embed/PwSO7l-iRLQ">
          </iframe>
          <br /><br />
        </Container>
      </>
    );
  }
}
