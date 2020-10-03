import React,{ Component } from 'react';
import Menu from './MenuComponent.js';
import DishDetail from './DishDetailComponent.js';
import Header from './HeaderComponent.js';
import Footer from './FooterComponent.js';
import Home from './HomeComponent.js';
import Contact from './ContactComponent.js';
import About from './AboutComponent.js';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postFeedback, postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators.js';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
};


const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment) ),
  fetchDishes: () => {dispatch(fetchDishes() )},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback') )},
  fetchComments: () => {dispatch(fetchComments() )},
  fetchPromos: () => {dispatch(fetchPromos() )},
  fetchLeaders: () => {dispatch(fetchLeaders() )},
  postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) => { dispatch(postFeedback(firstname , lastname, telnum, email, agree, contactType, message) ) }
});


class Main extends Component {




  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }



  filterDish(){
    let i = 0;

    for(i = 0; i < this.props.dishes.dishes.length; i++){
      if(this.props.dishes.dishes[i].id === this.props.selectedDish){
        return this.props.dishes.dishes[i];
      }
    }

    return null;
  }


  render(){

    const HomePage = () => {
      return (<Home dish={this.props.dishes.dishes.filter( (dish) => dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess={this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter( (promo) => promo.featured)[0]}
        promoLoading={this.props.promotions.isLoading}
        promoErrMess={this.props.promotions.errMess}
        leader={this.props.leaders.leaders.filter( (leader) => leader.featured)[0]}
        leaderLoading={this.props.leaders.isLoading}
        leaderErrMess={this.props.leaders.errMess} />);
    }


    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.filter( (dish) => dish.id === parseInt(match.params.dishId , 10) )[0] } 
        Loading={this.props.dishes.isLoading}
        errMess={this.props.dishes.errMess}
        comments={this.props.comments.comments.filter( (comment) => comment.dishId === parseInt(match.params.dishId , 10) ) } 
        commentErrMess={this.props.comments.errMess}       
        postComment={this.props.postComment} 
        />
      );
    }

    return (
      <div>
        <Header />
          <TransitionGroup>
            <CSSTransition key={this.props.location.key} classNames="page" timeout={300}  >
              <Switch>
                <Route path="/home" component={HomePage} />
                <Route exact path="/menu" component={ () => <Menu dishes={this.props.dishes} /> } />
                <Route path="/menu/:dishId" component={DishWithId} />
                <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} /> } />
                <Route exact path="/aboutus" component={ () => <About leaders={this.props.leaders} /> } />
                <Redirect to="/home" />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));