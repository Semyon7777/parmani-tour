import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "./BookForm.css";
import termsContent from "../terms"; // Assuming this is a placeholder; update as needed
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import toursData from "../toursPage/toursData.json";


function BookForm() {
const { t, i18n } = useTranslation();
  const { tourName } = useParams(); // Получаем название тура из параметров
  const cleanTourName = tourName.replace("-reservation", "");
  console.log(cleanTourName);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const datePickerRef = useRef();

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // Открытие DatePicker при нажатии на иконку
    }
  };

  const currentTour = toursData.find(tour => tour.id === cleanTourName);

  const [formData, setFormData] = useState({
    tourName: cleanTourName,
    firstName: '',
    lastName: '',
    year: '',
    from: '', 
    startDate: new Date(),
    days: '',
    state: '',
    city: '',
    pincode: false,
    course: false,
    email: ''
  });

  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1); // Default to 1 person
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const incrementPeople = () => {
    if (numberOfPeople < 5) {
      setNumberOfPeople(numberOfPeople + 1);
    }
  };

  const decrementPeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

  const handleStartDateChange = (date) => {
    setFormData({ ...formData, startDate: date });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      [id]: checked
    });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, days: e.target.id });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // ОСНОВНАЯ ЛОГИКА ОТПРАВКИ
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError(t('bookForm.errorAgreeToTerms'));
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'year', 'from', 'days', 'state', 'city', 'email'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(t('bookForm.errorEmptyField', { field: t(`bookForm.fields.${field}`) }));
        return;
      }
    }

    if (!validateEmail(formData.email)) {
      setError(t('bookForm.errorInvalidEmail'));
      return;
    }

    setError('');
    setIsSubmitting(true); // Включаем спиннер

    // Подготовка данных для EmailJS (аналог dataToSend)
    const templateParams = {
      tourName: cleanTourName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone_number: formData.state, // ты используешь поле state как телефон или страну?
      city: formData.city,
      from: formData.from,
      year: formData.year,
      startDate: formData.startDate.toLocaleDateString(),
      people: numberOfPeople,
      pincode: formData.pincode ? "Tickets included" : "No tickets",
      course: formData.course ? "Food included" : "No food"
    };

    try {
      // --- НОВЫЙ КОД EMAILJS ---
      await emailjs.send(
        'service_fkaou6c', // serviceID
        'template_ut3xykg', // templateID
        templateParams, 
        'IUMzWx8Tsm9hYF3UR' // publicKey
      );

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/tours");
      }, 5000);

      /* --- СТАРЫЙ AXIOS (ЗАКОММЕНТИРОВАН) ---
      await axios.post("https://tour-agency-api-la71.onrender.com/send-email", formData, dataToSend);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/tours");
      }, 5000);
      */
      
    } catch (err) {
      console.error("Booking Error:", err);
      alert(t('bookForm.errorSendingEmail') + " " + (err.text || err));
    } finally {
      setIsSubmitting(false); // Выключаем спиннер в любом случае
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    
    <Container fluid className='bookFormContainer'>
      <Row className='d-flex justify-content-center align-items-center h-100' style={{ transform: "none" }}>
        <Col>
          <Card className='my-4 BookFormCard' style={{ transform: 'none' }}>
            <Row className='g-0'>
              <Col md='6' className="d-md-block">
                <Card.Img src={currentTour?.imageUrl} alt={t('bookForm.samplePhotoAlt')} className="rounded-start" style={{ maxWidth: "100%", transition: "none", transform: "none" }} />
              </Col>
              <Col md='6'>
                <Card.Body className='text-black d-flex flex-column justify-content-center'>
                  <h3 className="mb-5 text-uppercase fw-bold">{cleanTourName + ' Tour'}</h3>
                  {error && <Alert variant='danger'>{error}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.firstName')}</Form.Label>
                          <Form.Control size='lg' id='firstName' type='text' value={formData.firstName} onChange={handleChange} className="custom-input"/>
                        </Form.Group>
                      </Col>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.lastName')}</Form.Label>
                          <Form.Control size='lg' id='lastName' type='text' value={formData.lastName} onChange={handleChange} className="custom-input"/>
                        </Form.Group>
                      </Col>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.year')}</Form.Label>
                          <Form.Control size='lg' id='year' type='text' value={formData.year} onChange={handleChange} className="custom-input"/>
                        </Form.Group>
                      </Col>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.from')}</Form.Label>
                          <Form.Control size='lg' id='from' type='text' value={formData.from} onChange={handleChange} className="custom-input"/>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className='mb-4' style={{ display: 'flex', alignItems: 'center', flexDirection: "row-reverse", justifyContent: "start"}}>
                      <Form.Label style={{margin:"3%", marginLeft: "0"}}>{t('bookForm.startDate')}</Form.Label>
                      <FaCalendarAlt style={{ marginRight: '10px', marginLeft: "10px", color: '#888', cursor: 'hand'}} onClick={handleIconClick} />
                      <DatePicker
                        ref={datePickerRef}
                        selected={formData.startDate}
                        onChange={handleStartDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-control custom-input"
                        minDate={new Date()} 
                        showYearDropdown
                        scrollableMonthYearDropdown
                      />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                      <Form.Label>{t('bookForm.numberOfPeople')}</Form.Label>
                      <div className="bookFormNumberOfPeopleContainer">
                        <Button variant="none" onClick={decrementPeople} className='minus'>-</Button>
                        <Form.Control
                          className="bookFormNumberOfPeopleBox custom-input"
                          type="number"
                          value={numberOfPeople}
                          readOnly // Make it read-only to avoid direct input
                        />
                        <Button variant="none" onClick={incrementPeople} className='plus'>+</Button>
                      </div>
                    </Form.Group>
                    <div className='d-md-flex justify-content-start align-items-center mb-4'>
                      <h6 className="fw-bold mb-0 me-4">{t('bookForm.days')}:</h6>
                      <Form.Check inline label='1' type='radio' name='days' id='days1' checked={formData.days === 'days1'} onChange={handleRadioChange} />
                      <Form.Check inline label='5' type='radio' name='days' id='days5' checked={formData.days === 'days5'} onChange={handleRadioChange} />
                      <Form.Check inline label='7' type='radio' name='days' id='days7' checked={formData.days === 'days7'} onChange={handleRadioChange} />
                    </div>
                    <Row>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.state')}</Form.Label>
                          <Form.Control as='select' size='lg' id='state' value={formData.state} onChange={handleChange} className="custom-input">
                            <option value='none'>{t('bookForm.choose')}</option>
                            <option>{t('bookForm.option1')}</option>
                            <option>{t('bookForm.option2')}</option>
                            <option>{t('bookForm.option3')}</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.city')}</Form.Label>
                          <Form.Control as='select' size='lg' id='city' value={formData.city} onChange={handleChange} className="custom-input">
                            <option value=''>{t('bookForm.choose')}</option>
                            <option>{t('bookForm.option1')}</option>
                            <option>{t('bookForm.option2')}</option>
                            <option>{t('bookForm.option3')}</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-3">
                        {t("bookForm.bookform_additional_services")}
                      </Form.Label>

                      <div className="addon-option">
                        <Form.Check
                          type="checkbox"
                          id="pincode"
                          label={t("bookForm.bookform_tickets")}
                          checked={formData.pincode}
                          onChange={handleCheckboxChange}
                        />
                      </div>

                      <div className="addon-option">
                        <Form.Check
                          type="checkbox"
                          id="course"
                          label={t("bookForm.bookform_lunch")}
                          checked={formData.course}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label>{t('bookForm.email')}</Form.Label>
                      <Form.Control size='lg' id='email' type='text' value={formData.email} onChange={handleChange} className="custom-input"/>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            {t('bookForm.agreeTermsPart1')}{' '}
                            <button
                              className="terms"
                              onClick={handleShow}
                              style={{ border: 'none', background: 'none', padding: 0, color: 'blue', textDecoration: 'underline' }}
                            >
                              {t('bookForm.agreeTermsLink')}
                            </button>
                            {t('bookForm.agreeTermsPart2')}
                          </span>
                        }
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                    </Form.Group>

                    <Modal show={showModal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>{t('bookForm.termsTitle')}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <ReactMarkdown>{termsContent[i18n.language]}</ReactMarkdown>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          {t('bookForm.closeButton')}
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div className="d-flex justify-content-end pt-3">
                      <Link to="/tours">
                        <Button variant='light' size='lg'>{t('bookForm.goBack')}</Button>
                      </Link>
                      <Button className='ms-2' variant='warning' size='lg' type="submit" disabled={isSubmitting}>{t('bookForm.submitForm')}</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {/* Notification Modal */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: "#4CAF50", /* Green background for the header */
            color: "white" /* White text color for the header */
          }}>
          <Modal.Title>{t('bookForm.modalTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body 
          style={{ 
            color: "#2E7D32" /* Dark green text color for the body */
          }}>
          {t('bookForm.modalBody')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowAlert(false)}>{t('bookForm.closeButton')}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BookForm;
