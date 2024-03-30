import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {

    // User info can be accessed with req.session
    const { id: userId } = req.session.id
    
    // No user info on the session means the user is not logged in
    if(!userId)
      return res.status(404).end()

    // DONE: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
    // DONE: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
    switch(req.method) {
      case 'POST': 
        const addedBook = await db.book.add(userId, req.body.book)
        return res.status(200).json.parse(addedBook)
      case 'DELETE': 
        const deletedBook = await db.book.add(userId, req.body.id)
        return res.status(200).json.parse(deletedBook)
      // DONE: Respond with 404 for all other requests
      default: 
        return res.status(404).end
    }
  },
  sessionOptions
)