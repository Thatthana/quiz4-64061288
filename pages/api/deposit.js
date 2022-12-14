import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function depositRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    // return res.status(403).json({ ok: false, message: "You do not have permission to deposit" });
    if (!user || user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to deposit",
      });
    }
    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount < 1) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater  than 0" });
    }
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });

    //find and update money in DB
    const users = readUsersDB();
    const userbalance = users.find((x) => x.username === user.username);
    userbalance.money += amount;
    writeUsersDB(users);
    return res.status(200).json({ ok: true, money: userbalance.money });

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
