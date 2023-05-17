import express, {Express, Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app: Express = express()
const port: any = process.env.PORT

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	next()
})

const employeeList: any = [
	{
		id: "1232",
		name: "Navani",
		fingerPrint: null,
	},
	{
		id: "4571",
		name: "Sundar",
		fingerPrint: "abcsdX5623784ghsd",
	},
	{
		id: "7820",
		name: "Yogesh",
		fingerPrint: null,
	},
]

app.get("/:id", (req: Request, res: Response) => {
	const {id} = req.params
	const getEmployeeDetails = employeeList.find((employee: any) => {
		return employee.id === id ? employee : null
	})

	console.log("getEmployeeDetails ::", getEmployeeDetails)

	res.json({data: getEmployeeDetails})
})

app.listen(port, () => {
	console.log("app Running...")
})

module.exports = app
