import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {

  // User info can be accessed with req.session 
  // No user info on the session means the user is not logged in
    if(!req.session.user)
      return res.status(401).end()

    const {id: userId} = req.session.user

    switch(req.method) {
      // DONE: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
      case 'POST': 
        const bookRequest = req.body
        const bookToAdd = JSON.parse(bookRequest)
        try{
          const addedBook = await db.book.add(userId, bookToAdd)
          console.log ("added book: ", addedBook)
          if(addedBook == null){
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json(addedBook)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

      case 'DELETE': 
        // DONE: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
        const bookIDRequest = req.body
        const bookToDelete = JSON.parse(bookIDRequest)
        try{
          const deletedBook = await db.book.remove(userId, bookToDelete.id)
          if(deletedBook == null){
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json(deletedBook)
        }catch(error){
          return res.status(400).json({error: error.message})
        }
      // DONE: Respond with 404 for all other requests
      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)