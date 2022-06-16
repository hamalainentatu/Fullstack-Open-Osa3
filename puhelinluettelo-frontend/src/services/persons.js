import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }

const deletePerson = newObject => {
    const id = newObject.id
    const request = axios.delete(baseUrl + "/" + id)
    return request.then(response => response.data)
}

const updateNumber = (newObject, id) => {
  const request = axios.put(baseUrl + "/" + id, newObject)
  return request.then(response => response.data)
}

export default { create, deletePerson, updateNumber }