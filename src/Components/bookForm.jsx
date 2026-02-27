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
import ReCAPTCHA from "react-google-recaptcha";
import toursData from "../toursPage/toursData.json";
import Calculator from './Calculator';


function BookForm() {
const { t, i18n } = useTranslation();
  const { tourName } = useParams(); 
  const cleanTourName = tourName.replace("-reservation", "");
  const [calculation, setCalculation] = useState(null);
  
  // 1. Создаем реф для капчи
  const recaptchaRef = useRef(); 
  const datePickerRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const currentTour = toursData.find(tour => tour.id === cleanTourName);

  const [formData, setFormData] = useState({
    tourName: cleanTourName,
    firstName: '',
    lastName: '',
    startDate: new Date(new Date().setHours(8, 0, 0, 0)),
    guide: 'none',
    phone: '',
    pincode: false,
    course: false,
    comments: '',
    email: ''
  });

  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const incrementPeople = () => { if (numberOfPeople < 7) setNumberOfPeople(numberOfPeople + 1); };
  const decrementPeople = () => { if (numberOfPeople > 1) setNumberOfPeople(numberOfPeople - 1); };
  const handleStartDateChange = (date) => { setFormData({ ...formData, startDate: date }); };
  const handleChange = (e) => { setFormData({ ...formData, [e.target.id]: e.target.value }); };
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData({ ...formData, [id]: checked });
  };
  // const handleRadioChange = (e) => { setFormData({ ...formData, days: e.target.id }); };
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // --- ОБНОВЛЕННАЯ ЛОГИКА ОТПРАВКИ С CAPTCHA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError(t('bookForm.errorAgreeToTerms'));
      window.scrollTo(0, 0);
      return;
    }

    const requiredFields = ['firstName', 'lastName','guide', 'startDate', 'email', 'phone'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(t('bookForm.errorEmptyField', { field: t(`bookForm.fields.${field}`) }));

        window.scrollTo(0, 0);
        return;
      }
    }

    if (!validateEmail(formData.email)) {
      setError(t('bookForm.errorInvalidEmail'));

      window.scrollTo(0, 0);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // 2. Получаем токен капчи
      const token = await recaptchaRef.current.executeAsync();

      if (!token) {
        setError("Captcha verification failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 3. Подготовка данных для EmailJS
      const templateParams = {
        tourName: cleanTourName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone_number: formData.phone, 
        startDate: formData.startDate.toLocaleString(),
        people: numberOfPeople,
        pincode: formData.pincode ? "Tickets included" : "No tickets",
        course: formData.course ? "Food included" : "No food",
        comments: formData.comments || "No special requests",

        // --- НОВЫЕ ПОЛЯ ДЛЯ ЦЕН (Конфиденциально) ---
        finalPrice: calculation?.finalPrice + " AMD but client will pay " + (Math.round((calculation?.finalPrice/ 1000)) * 1000),
        transportCost: calculation?.transportCost + " AMD",
        guideCost: calculation?.guideCost + " AMD",
        extraCost: calculation?.extraCost + " AMD",
        totalCostWithBuffer: calculation?.totalCostWithBuffer + " AMD",
        cleanProfit: calculation?.cleanProfit + " AMD",
        tax: calculation?.tax + " AMD",
        vehicleType: calculation?.vehicleType,
        vehicleCount: calculation?.vehicleCount,
        'g-recaptcha-response': token // Передаем токен
      };

      // 4. Отправка через EmailJS
      await emailjs.send(
        'service_fkaou6c', 
        'template_ut3xykg', 
        templateParams, 
        'IUMzWx8Tsm9hYF3UR' 
      );

      setShowAlert(true);
      recaptchaRef.current.reset(); // Сброс капчи

      setTimeout(() => {
        setShowAlert(false);
        navigate("/tours");
      }, 5000);

    } catch (err) {
      console.error("Booking Error:", err);
      alert(t('bookForm.errorSendingEmail') + " " + (err.text || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // --- В JSX КОМПОНЕНТА ---
  // Не забудь вставить это в самый конец return (перед последним </Container> или </div>):
  /*
    <ReCAPTCHA
      ref={recaptchaRef}
      size="invisible"
      sitekey="ТВОЙ_SITE_KEY_ОТ_GOOGLE"
    />
  */

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
                    </Row>
                    <Row>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.phone')}</Form.Label>
                          <Form.Control size='lg' id='phone' type='text' value={formData.phone} onChange={handleChange} className="custom-input"/>
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
                        dateFormat="dd/MM/yyyy HH:mm" // Добавили часы и минуты в формат
                        className="form-control custom-input"
                        minDate={new Date()}
                        
                        
                        // Настройки времени
                        showTimeSelect           // Включает выбор времени
                        timeFormat="HH:mm"       // Формат времени в выпадающем списке
                        timeIntervals={30}       // Шаг выбора времени (можно 15, 30, 60 мин)
                        timeCaption={t('bookForm.startTime')}       // Заголовок над временем

                        
                        // Ограничение диапазона (с 8 утра до 12 дня)
                        minTime={new Date(new Date().setHours(8, 0, 0))}
                        maxTime={new Date(new Date().setHours(12, 0, 0))}
                        
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
                    {/* <div className='d-md-flex justify-content-start align-items-center mb-4'>
                      <h6 className="fw-bold mb-0 me-4">{t('bookForm.days')}:</h6>
                      <Form.Check inline label='1' type='radio' name='days' id='days1' checked={formData.days === 'days1'} onChange={handleRadioChange} />
                      <Form.Check inline label='5' type='radio' name='days' id='days5' checked={formData.days === 'days5'} onChange={handleRadioChange} />
                      <Form.Check inline label='7' type='radio' name='days' id='days7' checked={formData.days === 'days7'} onChange={handleRadioChange} />
                    </div> */}
                    <Row>
                      <Col md='6'>
                        <Form.Group className='mb-4'>
                          <Form.Label>{t('bookForm.guide')}</Form.Label>
                          <Form.Control as='select' size='lg' id='guide' value={formData.guide} onChange={handleChange} className="custom-input">
                            <option value='none'>{t('bookForm.choose')}</option>
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

                    <Calculator
                      people={numberOfPeople}
                      includeGuide={formData.guide !== 'none'}
                      includeFood={formData.course}
                      includeTickets={formData.pincode}
                      onResult={setCalculation}
                      pricingData={currentTour?.budget?.pricing}
                    />

                    <Form.Group className='mb-4'>
                      <Form.Label>{t('bookForm.email')}</Form.Label>
                      <Form.Control size='lg' id='email' type='text' value={formData.email} onChange={handleChange} className="custom-input"/>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label>{t('bookForm.comments') || 'Special Requests / Comments (Optional)'}</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        id='comments' 
                        value={formData.comments} 
                        onChange={handleChange} 
                        placeholder={t('bookForm.commentsPlaceholder') || 'e.g. Vegetarian food, child car seat, pickup from Marriott Hotel...'}
                        className="custom-input"
                      />
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

                    {calculation && (
                      <div className="price-box">
                        <div className="price-box-left">
                          <div className="price-small">{t('bookForm.estimated_price')}</div>
                          <div className="price-main">
                            {(Math.round((calculation.finalPrice/ 1000)) * 1000).toLocaleString()} ֏
                          </div>
                        </div>

                        {/* <div className="price-box-right">
                          <div className="price-detail">
                            {t('bookForm.profit')}: {calculation.cleanProfit.toLocaleString()} ֏
                          </div>
                        </div> */}
                      </div>
                    )}

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
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey="6Lc3ZHMsAAAAAOWWtv3oxB3DtuzHbvNZrdrSOdU1"
          />
    </Container>
  );
}

export default BookForm;
