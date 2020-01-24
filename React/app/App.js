import React, { Component } from 'react';
import { render } from 'react-dom';
import M, { Collapsible } from "materialize-css";


class App extends Component {

    constructor() {
        super();
        this.state = {
            topic: '',
            title: '',
            description: '',
            values: [],
            count: [],
            id: '',
            current_page: 1
        }
        this.handleChange = this.handleChange.bind(this)
        this.addData = this.addData.bind(this)
    }

    //retrive data
    addData(e) {
        fetch('/app', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).
            then(content_data => {
                //console.log(content_data)
                this.setState({ topic: '', title: '', description: '' })
                this.retrive_data();
            })
            .catch(err => console.error(err));
        //console.log(this.state);
        e.preventDefault();
    }

    componentDidMount() {
        this.retrive_data(1);
        const options = {
            onOpenStart: () => {
                dismissible: false;
                //console.logconsole.log("Open Start");
            },
            onOpenEnd: () => {
                //console.log("Open End");
            },
            onCloseStart: () => {
                //console.log("Close Start");
            },
            onCloseEnd: () => {
                this.setState({ topic: '', title: '', description: '' });
                //console.log("Close End");
            },
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: false,
            startingTop: "4%",
            endingTop: "10%"
        };
        M.Modal.init(this.Modal_add, options);
        M.Modal.init(this.Modal_del, options);
    }
    retrive_data(page) {
        fetch('/app/param/' + page)
            .then(res => res.json())
            .then(data => {
                this.setState({ values: data.data_params, count: data.size, current_page: page })                
            });
    }

    // show data about topic by id
    showData(id) {
        //console.log('values')
        fetch('/app/values/' + id)
            .then(res => res.json())
            .then(data => {
                //console.log(data._id)
                this.setState({ topic: data.topic, title: data.title, description: data.description, id: data._id })
            });

    }

    // delete data by id, 
    deleteTask(id) {
        //console.log(id)
        fetch('/app/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                //console.log('delete')
                //console.log(data)
                this.retrive_data(this.state.current_page)
            })

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper">
                        <a href="#!" className="brand-logo center">Learning Path</a>
                    </div>
                </nav>
                <ul className="tabs tabs-fixed-width tab-demo z-depth-1 ">
                    <li className="tab"><a className="waves-effect waves-red btn green white-text ">Git</a></li>
                    <li className="tab"><a className="waves-effect waves-red btn green white-text ">JavaScript</a></li>
                    <li className="tab"><a className="waves-effect waves-red btn green white-text ">MongoDB</a></li>
                    <li className="tab"><a className="waves-effect waves-red btn green white-text ">NodeJS</a></li>
                    <li className="tab"><a className="waves-effect waves-red btn green white-text ">React</a></li>
                </ul>
                <div ref={Modals => {
                    this.Modal_del = Modals;
                }} id="modal2" className="modal">
                    <div className="modal-content">
                        <div className="row">
                            <h1>{this.state.topic}</h1>
                            <h3>{this.state.title}</h3>
                            <p>{this.state.description}</p>
                            <div class="modal-footer">
                                <a class="modal-close waves-effect waves-light btn-flat" onClick={() => this.deleteTask(this.state.id)}>Delete</a>
                                <a class="modal-close waves-effect waves-light btn-flat">Close</a>
                            </div>
                        </div>
                    </div>
                </div>

                <table className="center">
                    <tbody className="center">
                        {
                            this.state.values.map(val => {
                                return (
                                    <tr key={val._id}>
                                        <td>
                                            <i className="btn light-blue modal-trigger" onClick={() => this.showData(val._id)} href="#modal2">{val.topic}</i></td>
                                        <td>
                                            <button onClick={() => this.deleteTask(val._id)} className="btn light-blue darken-4">
                                                <i className="material-icons">delete</i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>


                <div className='pagination center'>                    {
                    this.state.count.map(number => {
                        return (
                            <li key={number} className="{classes}" onClick={() => this.retrive_data(number)}>
                                <a>{number}</a>
                            </li>
                        );
                    })
                }
                </div>

                <div className='center'>
                    {/*pop-up form to add data*/}
                    <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Add</a>
                    <div ref={Modals => {
                        this.Modal_add = Modals;
                    }} id="modal1" className="modal">
                        <div className="modal-content">
                            <div className="row">
                                <div className="col s12">
                                    <div className="card">
                                        <div className="card-content">
                                            <form onSubmit={this.addData}>
                                                <div className="row">
                                                    <div className="input-field col s12">
                                                        <input name="topic" onChange={this.handleChange} type="text" placeholder="topic" value={this.state.topic}>
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="input-field col s12">
                                                        <textarea name="title" onChange={this.handleChange} className="materialize-textarea" placeholder="Title" value={this.state.title}>
                                                        </textarea>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="input-field col s12">
                                                        <textarea name="description" onChange={this.handleChange} className="materialize-textarea" placeholder="Description" value={this.state.description}>
                                                        </textarea>
                                                    </div>
                                                </div>
                                                <div className="center">
                                                    <button className="center modal-close btn btn-light darken-4" type="submit">Send</button>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
render(<App />, document.getElementById('app'))
