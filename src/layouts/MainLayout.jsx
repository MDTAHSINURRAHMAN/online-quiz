import React from 'react';
import Banner from '../components/Banner';
import LeaderBoard from '../components/LeaderBoard';
const MainLayout = () => {
    return (
        <div className='container mx-auto font-nunito'>
            <Banner />
            <LeaderBoard />
        </div>
    );
};

export default MainLayout;