import react from 'react'

export default function DashboardPage(){
    return (
        <div>DashboardPage
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form></div>
    )
}