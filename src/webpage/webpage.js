import React from 'react'
import { Slide } from 'react-slideshow-image';
import PropTypes from 'prop-types'
import Modal from './modal';
const token = '119507c09798f8d93c9919f7a7f013e62b2dced5d61dd87970eca449ae8e399e'
const valentines = [
  {
    firstname: 'James',
    lastname: 'Isreal',
    username: 'james_v',
    headline: 'valentine special',
    story:
    "\
    Love like you'll never be hurt, \
    And live like it's heaven on earth. \
    ",
    likes: 6
  },

  {
    firstname: 'Pamella',
    lastname: 'Stella',
    username: 'pstolla',
    headline: 'love is in the air',
    story:
    " \
    You know you're in love when \
    you can't fall asleep . \
    ",
    likes: 4
  },

  {
    firstname: 'Andrew',
    lastname: 'Chukwu',
    username: 'ac_mil',
    headline: 'andrew\'s light',
    story:
    "I am delighted to show \
     my love to all on this day",
    likes: 2
  },

  {

    firstname: 'Bright',
    lastname: 'Ose',
    username: 'bose',
    headline: 'we are lights when we love',
    story: "\
    Darkness cannot drive out darkness: only light can do that .\
   only love can do that",
    likes: 0,
  }
]

 const ReadModeContext = React.createContext({
    more: false
})



function Guides() {
  return(
    <div className='sixteen column wide'>
      <div className='ui inverted raised segment  center aligned'>
      <h2 className='ui header horizontal divider'><div className='ui heart icon'>Want to Keep a Valentine Memory</div></h2>
      <span>You too can create a precious memory by clicking the memoir button beneath</span>
      </div>
    </div>
  )

}

class ValidationDisplay extends React.Component {
    render() {
        return this.props.errors
            ? this.props.errors.map(err =>
                <div className="small bg-danger text-white mt-1 p-1"
                        key={ err } >
                    { err }
                  </div>)
                : null
        }


}



const GetValidationMessages = (elem) => {
    let errors = [];
    if (!elem.checkValidity()) {
        if (elem.validity.valueMissing) {
            errors.push("Value required");
        }
        if (elem.validity.tooShort) {
            errors.push("Value is too short");
        }
        if (elem.validity.rangeUnderflow) {
            errors.push("Value is too small");
        }
        if (elem.validity.rangeOverlow){
          errors.push('Maximum value required is 100')
        }
    }
    return errors;
}

class ModalForm extends React.Component {
  constructor(props) {
          super(props);
          this.formElements = {
              firstname: { label: "Firstame", name: "firstname",
                  validation: { required: true, minLength: 3 }},
              lastname: { label: "Lastname", name:"lastname",
                  validation: { required: true, minLength: 5 }},
              username: { label: "Username", name: "username",
                  validation: {  required: true, minLength: 5 }},
              headline: { label: "Headline", name: "headline",
                  validation: { required: true, minLength: 5 }},
              story:  { label: "Story", name: "story",
                  validation: { required: true, maxLength: 100 }},
          }
          this.state = {
              errors: {}
          }


    this.disabled = false
    this.error_msgs = {
      username: 'username already has a memoir',
      story: 'should not exceed 100 characters'
    }


  }
  openModalHandler = () => {
       this.setState({
           isShowing: true
       });
   }

   closeModalHandler = () => {
       this.setState({
           isShowing: false
       });
   }
   setElement = (element) => {
         if (element !== null) {
             this.formElements[element.name].element = element;
         }
     }
     handleAdd = () => {
         if (this.validateFormElements()) {
             let data = {};
             Object.values(this.formElements)
                 .forEach(v => {
                     data[v.element.name] = v.element.value;
                     v.element.value = "";
                 });
             data['likes'] = 0
             this.props.callback(data);
             this.formElements.firstname.element.focus();
         }
     }

     validateFormElement = (name) => {
         let errors = GetValidationMessages(this.formElements[name].element);
         this.setState(state => state.errors[name] = errors);
         return errors.length === 0;
     }
     validateFormElements = () => {
         let valid = true;
         Object.keys(this.formElements).forEach(name => {
             if (!this.validateFormElement(name)) {
                 valid = false;
             }
         })
         return valid;
     }


   render () {
         return (
             <div>
                 { this.state.isShowing ?
                   <div onClick={this.closeModalHandler} className="back-drop"></div> : null }

                 <button className="ui huge button open-modal-btn" onClick={this.openModalHandler}>Create Memoir</button>

                 <Modal
                     className="modal"
                     show={this.state.isShowing}
                     close={this.closeModalHandler}>
                     {
    Object.values(this.formElements).map(elem =>
        <div className="form-group p-2" key={ elem.name }>
            <label>{ elem.label }</label>
            { elem.name === 'story' ?
              <React.Fragment>
              <textarea className="form-control"
                  name={ elem.name }
                  maxlength='99'
                  ref={ this.setElement }
                  onChange={ () => this.validateFormElement(elem.name) }
                  { ...elem.validation} />
              <ValidationDisplay
                   errors={ this.state.errors[elem.name] } />
               </React.Fragment>
                  :
            <React.Fragment>
            <input className="form-control"
                name={ elem.name }
                autoFocus={ elem.name === "firstname" }
                ref={ this.setElement }
                onChange={ () => this.validateFormElement(elem.name) }
                { ...elem.validation} />
              {elem.name === 'username' ? this.props.errors : ''}
            <ValidationDisplay
                 errors={ this.state.errors[elem.name] } />
             </React.Fragment>
             }
        </div>)
}
<div className="text-center">
    <button className="btn btn-primary" disabled={this.props.disabled} onClick={ this.handleAdd }>
        Add
    </button>
</div>

                 </Modal>
             </div>
         );
     }

}

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,  indicators: true,
  arrows: true,
  onChange: (oldIndex, newIndex) => {
    console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  }
}




class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      images: [],
      memoirs: valentines,
      vtype: {more: false},
      error: ''

    }

    this.vtext = 'view more'

  }

  saveData = (item) => {

    let main = Object.keys(this.state.memoirs).filter(key => this.state.memoirs[key].username === item.username )
    if (main.length !== 0){
      this.setState({error: 'user can not create more than once'})

    }
    else{
      this.setState({memoirs: this.state.memoirs = this.state.memoirs.concat(item)}, )
      this.setState({error: ''})

   }
 }
  componentDidMount(){

    fetch(`https://api.unsplash.com/search/photos?query=valentine`,{
      method: 'GET',
      headers: new Headers({'Authorization': `Client-ID ${token}`})
    }
    ).then(res => res.json()).then((data) => {
      this.setState({images: data.results.slice(0,5)
      })
      data.results.forEach(i => {
        //console.log(i.urls.full)
    }
    )}).catch(console.log)
  }
  toggleView =(ev, id) => {
    ev.persist()
    this.setState({vtype: !this.state.vtype.more})


//    this.vtype

  }

  tbc(ev, id) {


    Object.keys(this.state.memoirs).filter(key => this.state.memoirs[key].username === ev.target.id)
    .forEach(key => this.state.vtype.more == false ?
        this.setState(state => this.state.memoirs[key].story = this.state.memoirs[key].story.slice(0,100), () =>
      {this.vtext = ''})

        :


        this.setState(state => this.state.memoirs[key].story = this.state.memoirs[key].story.slice(0,40) + '...', () => {
          {this.vtext = 'view less'}
        })

    )
  }



   handleLikes = (ev) => {

      Object.keys(this.state.memoirs).filter(p => this.state.memoirs[p].username === ev.target.id)
      .forEach(p => this.setState(state => this.state.memoirs[p].likes = this.state.memoirs[p].likes + 1))
  }

  render () {
    const { memoirs } = this.state.memoirs
    return(
      <div className='ui segment'>
        <div className='row'>

          <div className='col-12'>
            <div
              className='slide-container'
              style={{'height': '19em'}}>
              <Slide {...properties}>

                {
                  this.state.images.map(p =>
                  <div className='each-slide'  key={p.id}>
                    <img
                      src={p.urls.full}
                      width='100%'
                      height='400px'/>

                  </div>


                )}
              </Slide>
            </div>
          </div>
        </div>



        <div className='row'>
          <div className='offset-2 col-8 offset-2'>
            <div className="ui vertical stripe quote segment">
              <div className="ui equal width stackable internally celled grid">
                <div className="center aligned row">

                  <Guides />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='offset-4 col-4 offset-4'>

            <ModalForm errors={this.state.error} callback={this.saveData}/>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className="ui cards">
              {this.state.memoirs.map(m =>

                <div className="card" key={m.username}>
                  <div className="content">
                    <div className="header">
                      <div className='ui  huge circular label'>
                      {m.firstname[0]}{m.lastname[0]}
                    </div>
                    </div>
                    <div className="meta">
                      {m.headline}
                    </div>
                    <div className="description">
                      <span id={m.username} onClickCapture={this.tbc}>
                        {this.state.vtype.more ? m.story.slice(0, 40) : m.story.slice(0,100)}


                      <button className='ui small button'  onClick={this.toggleView}>
                        {this.vtext}
                      </button>
                    </span>

                    </div>
                  </div>

                  <div className="extra content">
                    <span className="left floated like"  >
                      <i id={m.username} onClick={this.handleLikes} className={`like  icon ${ m.likes === 0 ? 'default' : 'red'} `}>
                      </i>
                      {m.likes}
                    </span>
                  </div>
                </div>


              )}
            </div>
          </div>

        </div>
      </div>


      )
  }
}


export default Main;
