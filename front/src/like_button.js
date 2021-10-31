'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    // if (this.state.liked) {
    //   return 'You liked this.';
    // }


    // return (
    //   <div className="shopping-list">
    //     <h1>Liste de courses pour {this.props.name}</h1>
    //     <ul>
    //       <li>Instagram</li>
    //       <li>WhatsApp</li>
    //       <li>Oculus</li>
    //     </ul>
    //   </div>
    // );

    return React.createElement("div", {
      className: "shopping-list"
    }, /*#__PURE__*/React.createElement("h1", null, "Shopping List for toto"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Instagram"), /*#__PURE__*/React.createElement("li", null, "WhatsApp"), /*#__PURE__*/React.createElement("li", null, "Oculus")));
    
  }
}


const domContainer = document.getElementById('like_button_container');
ReactDOM.render(React.createElement(LikeButton, null), domContainer);