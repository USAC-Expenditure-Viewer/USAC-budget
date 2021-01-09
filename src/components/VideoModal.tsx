import React from 'react';
import {
  Modal,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from 'reactstrap';

interface VideoModalProps {
  open: boolean,
  close: () => void
}


export default class VideoModal extends React.Component<VideoModalProps> {

  render() {
    return (
      <>
        <Modal
          toggle={this.props.close}
          isOpen={this.props.open}
          style={{border: 'groove', backgroundColor: 'lightblue', width: 1200, height: 860, position: 'absolute', top: 40}}
        >
          <Card>
            <CardHeader>
              <h2 style={{textAlign: 'center'}}>
                USAC Budget Viewer Tutorial Video
              </h2>
            </CardHeader>
            <CardBody>
              <div style={{margin: 'auto', marginLeft: 100}}>
                <iframe width="960" height="700" 
                  src="https://www.youtube.com/embed/PwSO7l-iRLQ">
                </iframe>
              </div>
            </CardBody>
            <CardFooter>
              <div style={{margin: 'auto', marginLeft: 525}}>
                <Button 
                  onClick={this.props.close}
                  type="button"
                  style={{height: 45, width: 65, backgroundColor: 'white', fontSize: 20}}
                >
                  Close
                </Button>
              </div>
            </CardFooter>
          </Card>
          </Modal>
      </>
    );
  }
}
