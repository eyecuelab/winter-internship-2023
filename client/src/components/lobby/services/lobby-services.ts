import axios from "axios"

export const getUserDataGoogle = async (accessToken: string) => {
	// const { data } = await axios.get(`http://localhost:3001/api/google/userData?accessToken=${accessToken}`, {
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// })
  const { data } = await axios.get(`https://super-pacart.fly.dev/api/google/userData?accessToken=${accessToken}`, {
		headers: {
			"Content-Type": "application/json",
		},
	})
	return data
}