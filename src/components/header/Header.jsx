import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  //because the styling of all the navItems(nav btn) in navbar will be same so we will make an array of navItem(nav btn) and will run loop on that
  //all the navItmes is kept as an object consting of name(btn content), slug(on click navigation) and active(to show or not)
  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: 'Login',
      slug: "/login",
      active: (!authStatus)  //i.e. if authStatus is true it means user is already loged in so dont show login btn.
    },
    {
      name: 'Signup',
      slug: "/signup",
      active: (!authStatus)
    },
    {
      name: 'My Posts',
      slug: "/all-posts",
      active: authStatus   //if loged in then onlyn show this
    },
    {
      name: 'Add Post',
      slug: "/add-post",
      active: authStatus
    },
  ]

  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          <ul className='flex ml-auto'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >{item.name}</button>
                </li>
              ) : null
            )}

            {authStatus &&
              <li>
                <LogoutBtn />
              </li>
            }
          </ul>

        </nav>
      </Container>
    </header>




    // <ul className='flex ml-auto'>
    //   {navItems.map((item) => 
    //   item.active ? (
    //     <li key={item.name}>
    //       <button
    //       onClick={() => navigate(item.slug)}
    //       className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    //       >{item.name}</button>
    //     </li>
    //   ) : null
    //   )}
    //   {authStatus && (
    //     <li>
    //       <LogoutBtn />
    //     </li>
    //   )}
    // </ul>
  )
}

export default Header