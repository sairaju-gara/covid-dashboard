import './index.css'

const FaqItem = props => {
  const {faqDetails} = props
  const {answer, question} = faqDetails

  return (
    <li className="faq-item">
      <p className="faq-question">{question}</p>
      <p className="faq-response">{answer}</p>
    </li>
  )
}

export default FaqItem
