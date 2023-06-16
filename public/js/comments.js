('use strict');

const e = React.createElement;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      message: '',
    };
    this.idNews = parseInt(window.location.href.split('/').reverse()[0]);
    const bearerToken = Cookies.get('authorization');
    this.socket = io('http://localhost:3000', {
      query: {
        newsId: this.idNews,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + bearerToken,
          },
        },
      },
    });
  }

  componentDidMount() {
    this.getAllComments();

    this.socket.on('newComment', (message) => {
      const comments = this.state.comments;
      comments.push(message);
      this.setState(comments);
    });
    this.socket.on('removeComment', (payload) => {
      const { id } = payload;
      const comments = this.state.comments.filter((c) => c.id !== id);
      this.setState({ comments });
    });
  }

  getAllComments = async () => {
    const response = await fetch(
      `http://localhost:3000/comments/api/details/${this.idNews}`,
      { method: 'GET' },
    );
    if (response.ok) {
      const comments = await response.json();
      this.setState({ comments });
    }
  };

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  sendMessage = () => {
    this.socket.emit('addComment', {
      idNews: this.idNews,
      message: this.state.message,
    });
  };

  removeComment = (idComment) => {
    fetch(
      `http://localhost:3080/comments/api/details/${this.idNews}/${idComments}`,
      { method: 'DELETE' },
    );
  };

  render() {
    const userId = parseInt(getCookie('userId'));
    return (
      <div>
        {this.state.comments.map((comment, index) => {
          return (
            <div key={comment + index} className="card mb-1">
              <strong>{comment.user.firstName}</strong>
              <div>{comment.message}</div>
              <div>
                {comment.user.id == userId && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => this.removeComment(comment.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <hr />
        <div>
          <h6 className="lh-1 mt-3">Add comment form</h6>
          <div className="form-floating mb-1">
            <textarea
              className="form-control"
              name="message"
              id="message"
              cols="30"
              rows="10"
              placeholder="Leave a comment here"
              value={this.state.message}
              onChange={this.onChange}
            ></textarea>
            <label htmlFor="message">Comment</label>
          </div>
        </div>
      </div>
    );
  }
}
