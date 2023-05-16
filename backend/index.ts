import express, {Express, Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.get("/:id", async (req: Request, res: Response) => {
	const {id} = req.params
	console.log("id:;", id)
	res.json({data: "hello"})
})

app.listen(port, () => {
	console.log("app Running...")
})

module.exports = app
