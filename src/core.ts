import { Database } from "bun:sqlite";

// class Item_ {
//   public title: string
//   constructor(title: string) {
//     this.title = title
//   }
// }

const db = new Database("database.sqlite")

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL
  )
`)

const querySelectItems = db.query("SELECT * FROM items")
const queryInsertItem = db.query("INSERT INTO items (title) VALUES (?)")
const queryDeleteItem = db.query("DELETE FROM items WHERE id = $id")
const queryUpdateItem = db.query("UPDATE items SET title = $title WHERE id = $id")

class Item {
  constructor(public title: string) { }
}


class TodoList {

  addItem(item: Item) {
    
  }

  removeItem(index: number) {
    
  }

  getItems() {
    const items = querySelectItems.all()
    return items
  }
}


const lista = new TodoList()
lista.addItem(new Item("ficar quieto"))
lista.addItem(new Item("prestar atenção"))
lista.addItem(new Item("aprender typescript"))
console.log(lista.getItems())

