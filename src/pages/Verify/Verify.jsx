import { useNavigate, useSearchParams } from 'react-router-dom'
import './Verify.css'
import { useContext, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const { API_BASE_URL } = useContext(StoreContext)
    const navigate = useNavigate()

    const verifyPayment = async () => {
        const response = await axios.post(API_BASE_URL + '/api/order/verify', {
            success,
            orderId,
        })
        if (response.data.success) {
            navigate('/myorders')
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className="verify">
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
