import axios from 'axios';

export default axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  headers: {
    Authorization: 'Bearer YOUR_YELP_API_KEY'
  }
})