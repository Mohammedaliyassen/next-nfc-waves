import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './story.css'
import Edit from './Edit.tsx';
function Story(props) {
  const { linkTo, discStory, storyTittle, imgStory, editbtn = false, deleteBtn, doThis } = props
  return (
    <Card style={{ width: '18rem', padding: '0', margin: '30px', borderRadius: '20px', overflow: 'hidden' }} className='storyCard'>
      <img variant="top" alt={storyTittle} src={imgStory} />
      <Card.Body>
        <Card.Title style={{ color: '#fff' }}>{storyTittle}</Card.Title>
        <Card.Text style={{ color: '#fff' }}>
          {discStory}
        </Card.Text>


        {editbtn ?
          <>
            <Button onClick={doThis} variant="primary">
              <Edit size={18} />
              <p style={{ display: 'inline' }}>edit</p>
            </Button>
          </>
          : <Button variant="primary">
              <a href={linkTo} style={{ color: '#fff' }}> Show Me </a>
            </Button>}
        {deleteBtn ? deleteBtn : null}
      </Card.Body>
    </Card>
  );
}

export default Story;