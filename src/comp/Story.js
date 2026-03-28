import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Edit from './Edit';
function Story(props) {
  const { linkTo, discStory, storyTittle, imgStory, editbtn = false, deleteBtn, doThis } = props
  return (
    <Card style={{ width: '18rem', padding: '0', margin: '30px', borderRadius: '20px', overflow: 'hidden' }} className='storyCard'>
      <img variant="top" alt={storyTittle} src={imgStory} />
      <Card.Body>
        <Card.Title style={{ color: '#fff' }} className='notranslate'>{storyTittle}</Card.Title>
        <Card.Text style={{ color: '#fff' }}>
          {discStory}
        </Card.Text>


        {editbtn ?
          <>
            <Button onClick={doThis} variant="primary">
              <Edit size={18} />
              <p style={{ display: 'inline' }} className='notranslate'>edit</p>
            </Button>
          </>
          : <Button variant="primary">
            <a href={linkTo} style={{ color: '#fff' }} className='notranslate'> Show Me </a>
          </Button>}
        {deleteBtn ? deleteBtn : null}
      </Card.Body>
    </Card>
  );
}

export default Story;
