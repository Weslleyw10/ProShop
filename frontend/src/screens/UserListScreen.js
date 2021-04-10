import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'

import { list, deleteUser } from '../actions/userActions'

export default function UserListScreen({ history }) {

    const dispatch = useDispatch()

    const userList = useSelector(state => state.usersList)
    const { loading, error, users } = userList

    const user = useSelector(state => state.userLogin)
    const { userInfo } = user

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) {
            dispatch(list())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, successDelete, userInfo])

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this user?'))
        dispatch(deleteUser(id))
    }

    return (
        <div>
            <h1>Users</h1>
            {
                loading ? (<Loader />) :
                    error ? (<Message variant='danger'>{error}</Message>) :
                        (
                            <Table striped bordered hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(user => (
                                            <tr key={user._id}>
                                                <td>{user._id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    {user.isAdmin ? (
                                                        <i className='fas fa-check' style={{ color: 'green' }}></i>
                                                    ) : (<i className='fas fa-check' style={{ color: 'red' }}></i>)}
                                                </td>
                                                <td>
                                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                        <Button variant='light' className='btn-sm'>
                                                            <i className='fas fa-edit'></i>
                                                        </Button>
                                                    </LinkContainer>

                                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                                        <i className='fas fa-trash'></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
            }

        </div>
    )
}
