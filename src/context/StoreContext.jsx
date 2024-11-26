import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState('')
    const [food_list, setFoodList] = useState([])

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(
                API_BASE_URL + '/api/cart',
                { itemId },
                { headers: { token } },
            )
        }
        toast.success('Item added to cart successfully.')
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.put(
                API_BASE_URL + '/api/cart',
                { itemId },
                { headers: { token } },
            )
        }
        toast.success('Item removed from cart successfully.')
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount
    }

    const fetchFoodList = async () => {
        const response = await axios.get(API_BASE_URL + '/api/food')
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.get(API_BASE_URL + '/api/cart', {
            headers: { token },
        })
        setCartItems(response.data.data)
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList()
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'))
                await loadCartData(localStorage.getItem('token'))
            }
        }
        loadData()
    }, [localStorage.getItem('token')])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        API_BASE_URL,
        token,
        setToken,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
