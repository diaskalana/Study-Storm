import { Col, Row } from 'react-bootstrap';
import notFoundStyles from '../styles/404Styles.module.css';

const NotFoundPage = () => {

    return (
        <>
            <Col className={notFoundStyles.mainDiv}>
                <Row><h1 className={notFoundStyles.mainText}>Oops!</h1></Row>
                <p className={notFoundStyles.mainPara}>404 - PAGE NOT FOUND</p>
                <p className={notFoundStyles.para}>The page you are looking for might have been removed, <br />had its name changed or is temporarily unavailable.</p>
            </Col>
        </>
    );
}

export default NotFoundPage;