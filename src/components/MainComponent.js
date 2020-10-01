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
import { addComment, fetchDishes } from '../redux/ActionCreators.js';
import Loading from './LoadingComponent.js';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
};


const mapDispatchToProps = (dispatch) => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment) ),
  fetchDishes: () => {dispatch(fetchDishes() )}
});


class Main extends Component {

  constructor(props){
    super(props);

  }


  componentDidMount(){
    this.props.fetchDishes();
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
      promotion={this.props.promotions.filter( (promo) => promo.featured)[0]}
      leader={this.props.leaders.filter( (leader) => leader.featured)[0]} />);
    }


    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.filter( (dish) => dish.id === parseInt(match.params.dishId , 10) )[0] } 
        Loading={this.props.dishes.isLoading}
        errMess={this.props.dishes.errMess}
        comments={this.props.comments.filter( (comment) => comment.dishId === parseInt(match.params.dishId , 10) ) } 
        addComment={this.props.addComment} 
        />
      );
    }

    return (
      <div>
        <Header />
          <Switch>
            <Route path="/home" component={HomePage} />
            <Route exact path="/menu" component={ () => <Menu dishes={this.props.dishes} /> } />
            <Route path="/menu/:dishId" component={DishWithId} />
            <Route exact path="/contactus" component={Contact} />
            <Route exact path="/aboutus" component={ () => <About leaders={this.props.leaders} /> } />
            <Redirect to="/home" />
          </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
