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
  private _id: number;
  constructor(
    public title: string,
    id?: number,
  ) {
    if (id) {
      this._id = id;
    } else {
      const item_number = queryInsertItem.run(this.title).lastInsertRowid;
      this._id = item_number as number;
    }
  }
  updateItem(newTitle: string) {
    queryUpdateItem.run(newTitle, this._id);
    this.title = newTitle;
  }

  deleteItem() {
    queryDeleteItem.run(this._id);
    this._id = NaN;
    this.title = "";
  }

  getId() {
    return this._id;
  }
}


class TodoList {
  private items: Item[] = querySelectItems
    .all()
    .map((i: any) => new Item(i.title, i.id));

  getItems() {
    return this.items;
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  removeItems(id: number) {
    const index = this.items.findIndex((i) => i.getId() === id);

    if (index !== -1) {
      this.items[index]?.deleteItem();
      this.items.splice(index, 1);
    }
  }

  updateItems(id: number, newTitle: string) {
    this.items.forEach((i) => {
      if (i.getId() == id) {
        i.updateItem(newTitle);
        i.title = newTitle;
      }
    });
  }
}


const lista = new TodoList()
lista.addItem(new Item("Tira"))
lista.addItem(new Item("Pôe"))
lista.addItem(new Item("Deixa ficar"))
lista.removeItems(1);
lista.updateItems(3, "guerreiros são guerreiros");
console.log(lista.getItems())

