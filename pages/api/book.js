import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    console.log(req.body)

    // User info can be accessed with req.session
    const {id: userId} = req.session.user

    console.log("userId: " , userId)
    // No user info on the session means the user is not logged in
    // if(!userId)
    //   return res.status(401).end()

    // DONE: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
    // DONE: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
    switch(req.method) {
      case 'POST': 
        const bookRequest = req.body
        const bookToAdd = JSON.parse(bookRequest)
        const addedBook = await db.book.add(userId, bookToAdd)
        console.log ("added book: ", addedBook)
        if(addedBook == null){
          console.log ("added book is null")
          req.session.destroy()
          return res.status(401)
        }
        return res.status(200).json(addedBook)

      case 'DELETE': 
        const bookIDRequest = req.body
        const bookToDelete = JSON.parse(bookIDRequest)
        const deletedBook = await db.book.remove(userId, bookToDelete.id)
        console.log ("deleted book: ", deletedBook)
        if(deletedBook == null){
          console.log ("deleted book is null")
          req.session.destroy()
          return res.status(401)
        }
        return res.status(200).json(deletedBook)
      // DONE: Respond with 404 for all other requests
      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)