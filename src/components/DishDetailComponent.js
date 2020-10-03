import React , { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardText, CardBody, CardTitle , Breadcrumb,
		 BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row,
		 Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent.js';
import { baseUrl } from '../shared/baseUrl.js';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';



const minLength = (len) => (val) => (val) && (val.length >= len);
const maxLength = (len) => (val) => !(val) || (val.length <= len);



class CommentForm extends Component{

	constructor(props){
		super(props);

		this.state = {
			isModalOpen: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}



	toggleModal(){
		this.setState({isModalOpen: !this.state.isModalOpen});
	}


	handleSubmit(values){
		this.toggleModal();
		this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
	}


	render(){
		return (
			<div>
				<Button outline color="secondary" onClick={this.toggleModal} >
					<i class="fa fa-pencil"></i> Submit Comment
				</Button>

				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
					<ModalHeader toggle={this.toggleModal}>
						Submit Comment
					</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values) } >
							<Row className="form-group mx-1">
								<Label htmlFor="rating" >Rating</Label>
								<Control.select model=".rating" name="rating" 
									id="rating" className="form-control" >
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
								</Control.select>
							</Row>
							<Row className="form-group mx-1">
								<Label htmlFor="author" >Your Name</Label>
								<Control.text model=".author" name="author"
									id="author" className="form-control"
									placeholder="Your Name"
									validators={{
										minLength: minLength(3),
										maxLength: maxLength(15)
									}}
								/>
								<Errors 
									className="text-danger"
									model=".author"
									show="touched"
									messages={{
										minLength: 'Must have at least 3 characters ',
										maxLength: 'Must have less then 15 characters '
									}}
								/>
							</Row>
							<Row className="form-group mx-1">
								<Label htmlFor="comment">Comment</Label>
								<Control.textarea model=".comment" 
									id="comment" className="form-control"
									rows="6"
								/>
							</Row>
							<Row className="form-group mx-1">
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </Row>

						</LocalForm>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}


function RenderDish({dish}){
	return (
		<div className="col-12 col-md-5 m-1">
			<FadeTransform in 
				transformProps={{
					exitTransform: 'scale(0.5) translateY(-50%)'

				}} >
				<Card>
					<CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
					<CardBody>
						<CardTitle heading>{dish.name}</CardTitle>
						<CardText>{dish.description}</CardText>
					</CardBody>
				</Card>
			</FadeTransform>
		</div>
	);
}


function RenderComments({comments, postComment, dishId}){
	if(comments !== null){
		return (
			<div className="col-12 col-md-5 m-1">
				<h4>Comments</h4>
				<ul className="list-unstyled">
					<Stagger in>
						{comments.map( (comment) => {
							return (
								<Fade in>
									<li key={comment.id} >
									<p>{comment.comment}</p>
									<p>-- {comment.author} , {comment.date.slice(0,10)}</p>
									</li>
								</Fade>	
							);
						})}
					</Stagger>
				</ul>
				<CommentForm dishId={dishId} postComment={postComment} />
			</div>
		);
	}
	else {
		return (<div></div>);
	}	 
}


const DishDetail = (props) => {
	if(props.isLoading){
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	}
	else if(props.errMess){
		return (
			<div className="container">
				<div className="row">
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	}

	else if(props.dish !== null){
		return(
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className="col-12">
						<h3>{props.dish.name}</h3>
						<hr />
					</div>
				</div>
				<div className="row">
					<RenderDish dish={props.dish} />
					<RenderComments comments={props.comments} 
						postComment={props.postComment} 
						dishId={props.dish.id} />
				</div>
			</div>
		);
	}
	else {
		return (<div></div>);
	}
}

export default DishDetail;