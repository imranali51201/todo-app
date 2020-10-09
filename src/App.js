import React, { Component } from 'react'
import './App.css';
import { Modal, Button, Popover, Input, Empty, message } from 'antd'
import { PlusOutlined, FileTextOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';

export default class App extends Component {
  constructor(getTodos) {
    super(getTodos)
    this.state = {
      date: Date().slice(0, 15),
      time: Date().slice(15, 21),
      addModalVisible: false,
      label: "",
      description: "",
      todoTime: "",
      todoDate: "",
      todos: this.getTodos(),
      edit: false,
      editIndex: null
    }
  }

  getTodos = () => JSON.parse(window.localStorage.getItem('todo')) || []
  saveTodos = () => window.localStorage.setItem('todo', JSON.stringify(this.state.todos))

  addTask = () => {
    const { label, description, todoDate, todoTime, todos, editIndex, edit } = this.state
    label && todoTime && todoDate ? edit ? todos[editIndex] = ({ label, description, todoDate, todoTime }) : todos.push({ label, description, todoDate, todoTime }) : message.error('Please Fill Correctly!')
    this.setState({ todos: [...todos] });
    this.saveTodos()
    label && todoTime && todoDate && this.setState({ addModalVisible: false })
    label && todoTime && todoDate && this.setState({ label: '', description: '', todoDate: '', todoTime: '', editIndex: null, edit: false });
  }

  delete = (i) => {
    const { todos } = this.state
    todos.splice(i, 1)
    this.setState({ todos: [...todos] });
    this.saveTodos()
  }

  update = (i) => {
    const { todos } = this.state
    this.setState({ editIndex: i, edit: true, addModalVisible: true })
    const todo = todos[i]
    this.setState({ label: todo.label, description: todo.description, todoDate: todo.todoDate, todoTime: todo.todoTime });
  }

  cancel = () => {
    this.setState({ label: '', description: '', todoDate: '', todoTime: '', edit: false, editIndex: null });
    this.setState({ addModalVisible: false })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {

    const { date, time, addModalVisible, todos, label, todoTime, description, todoDate, edit } = this.state

    return (

      <div className="App" >
        <div className="innerMain">


          <div className="top">
            <div className="date">
              <h1 className="time" >{time ? time : "00:00"}</h1>
              <span >{date ? date : "date"}</span>
            </div>
          </div>


          <div className="body">


            {todos.length ? todos.map((todo, i) => {
              return <Popover
                key={i}
                content={
                  <div>
                    <p><b>Description:</b> {todo.description}</p>
                    <p><b>Task Time:</b> {todo.todoTime}</p>
                    <p><b>Task Date:</b> {todo.todoDate}</p>
                    <div>
                      <Button onClick={() => this.update(i)}>Update</Button>
                      <Button type="primary" onClick={() => this.delete(i)}>Delete</Button>
                    </div>
                  </div>
                }
                title={todo.label}
                trigger="hover"
              >
                <p className="todo"><span>{todo.label}</span><span>View</span> </p>
              </Popover>
            }) : <Empty description="No Todo" />}


            <Button type="primary" size="large" className="btn" onClick={() => this.setState({ addModalVisible: true })} shape="circle" icon={<PlusOutlined />} />
            <Modal
              title="Create Todo"
              visible={addModalVisible}
              okText={edit ? "Update" : "Create"}
              cancelButtonProps={{ style: { display: 'none' } }}
              onOk={() => this.addTask()}
              onCancel={() => this.cancel()}
            >
              <Input className="input" placeholder="Title" type="text" prefix={<FileTextOutlined />} name="label" value={label} onChange={this.handleChange} />
              <Input className="input" placeholder="Description (Optional)" type="text" prefix={<FileTextOutlined />} name="description" value={description} onChange={this.handleChange} />
              <Input className="input" type="time" prefix={<ClockCircleOutlined />} name="todoTime" value={todoTime} onChange={this.handleChange} />
              <Input className="input" type="date" prefix={<CalendarOutlined />} name="todoDate" value={todoDate} onChange={this.handleChange} />
            </Modal>



          </div>



        </div>
      </div>
    )
  }
}



