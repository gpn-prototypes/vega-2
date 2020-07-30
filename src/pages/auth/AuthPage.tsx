import * as React from 'react';
import { Carousel, Text } from '@gpn-prototypes/vega-ui';
import { useAppContext } from '@vega/platform/app-context';
import { AuthForm } from '@vega/ui/features/auth';

import { cnAuthPage } from './cn-auth-page';

import './AuthPage.css';

export const AuthPage: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const { authAPI } = useAppContext();
  const { isFetching, login } = authAPI;

  const firstSlideCaption = 'Какой-то текст про Вега 2.0.';

  const secondSlideCaption =
    'Какой-то текст про то, какие задачи можно очень круто и быстро решать с помощью Веги 2.0.';

  return (
    <div className={cnAuthPage()}>
      <AuthForm
        isFetching={isFetching}
        onLogin={login}
        containerClassName={cnAuthPage('FormContainer')}
        formClassName={cnAuthPage('Form')}
      />
      <div className={cnAuthPage('Teaser')}>
        <Carousel currentIdx={idx} onChange={setIdx} className={cnAuthPage('TeaserCarousel')}>
          <Carousel.Slide caption={firstSlideCaption} className={cnAuthPage('Slide')}>
            <Text size="xl">Ведутся работы...</Text>
          </Carousel.Slide>
          <Carousel.Slide caption={secondSlideCaption} className={cnAuthPage('Slide')}>
            <Text size="xl">А здесь мы вам расскажем о возможностях системы</Text>
          </Carousel.Slide>
        </Carousel>
      </div>
    </div>
  );
};
