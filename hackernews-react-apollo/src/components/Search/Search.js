import React, { useState } from 'react'
import { withApollo } from 'react-apollo'

import Link from '../Link/Link'
import { FEED_SEARCH_QUERY } from './SearchQueries'

const Search = (props) => {
    const [links, setLinks] = useState([])
    const [filter, setFilter] = useState('')

    const _executeSearch = async () => {
        const result = await props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })
        const links = result.data.feed.links
        setLinks(links)
    }

    return (
        <div>
            <div>
                Search
                <input
                    type='text'
                    onChange={e => setFilter(e.target.value)} />
                <button onClick={_executeSearch}>OK</button>
                {links.map((link, index) => (
                    <Link
                        key={link.id}
                        link={link}
                        index={index} />
                ))}
            </div>
        </div>
    )
}

export default withApollo(Search)