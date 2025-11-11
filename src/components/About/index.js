import {Component} from 'react'
import Loader from 'react-loader-spinner'

import FaqItem from '../FaqItem'
import Footer from '../Footer'
import './index.css'

class About extends Component {
  state = {
    faqData: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getFaqData()
  }

  getFaqData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const faqResponse = await fetch(apiUrl)
    const faqItemsData = await faqResponse.json()
    this.setState({
      faqData: faqItemsData?.faq || [],
      isLoading: false,
    })
  }

  renderLoaderView = () => (
    <div data-testid="aboutRouteLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  render() {
    const {faqData, isLoading} = this.state

    return (
      <div className="app-about-container">
        {isLoading ? (
          this.renderLoaderView()
        ) : (
          <>
            <h1 className="about-header">About</h1>
            <h1 className="description-header">
              COVID-19 vaccines be ready for distribution
            </h1>
            <ul className="faq-data-container" data-testid="faqsUnorderedList">
              {faqData.map(eachFaqItem => (
                <FaqItem key={eachFaqItem.qno} faqDetails={eachFaqItem} />
              ))}
            </ul>
            <Footer />
          </>
        )}
      </div>
    )
  }
}

export default About
