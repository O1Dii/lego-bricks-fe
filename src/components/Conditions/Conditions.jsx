import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation/Navigation";
import { styled } from "@mui/material/styles";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import getSvg from "../../constants/svg";
import telegram_icon from "../../icons/telegram.png";
import * as React from "react";

// Импорт флагов (предполагаемые пути)
// import russiaFlag from "../../icons/russia-flag.png";
import belarusFlag from "../../icons/belarus.png";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: 'white',
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: '25px',
  height: '25px',
  backgroundColor: '#FF1B15',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const StepContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
}));

const CountryFlag = styled(Box)(({ theme }) => ({
  width: '25px',
  height: '25px',
  marginRight: theme.spacing(1),
  display: 'inline-block',
  verticalAlign: 'middle',
}));

const RussiaFlag = styled(CountryFlag)({
  background: 'linear-gradient(to bottom, white 33%, #0057b7 33%, #0057b7 66%, #dc3545 66%)',
  border: '1px solid #ddd',
});

// const BelarusFlag = styled(CountryFlag)({
//   background: 'linear-gradient(to bottom, #dc3545 50%, #28a745 50%)',
//   border: '1px solid #ddd',
// });

const SupportItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    color: '#0088cc',
  },
}));

export default function Conditions() {
  return (
    <>
      <Navigation />
      <StyledBox>
        <ContentContainer>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Условия покупки
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Добро пожаловать! Здесь вы можете собрать заказ из нужных деталей.
          </Typography>

          {/* Оформление заказа */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Оформление заказа
          </Typography>

          <StepContainer>
            <StepNumber>1</StepNumber>
            <Typography align={"left"} variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              Загрузите Wanted List с BrickLink — система автоматически добавит только доступные детали из вашего списка.
            </Typography>
          </StepContainer>

          <StepContainer>
            <StepNumber>2</StepNumber>
            <Typography align={"left"} variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              Или выбирайте детали вручную через каталог или поиск (по номеру, например, <em>3005</em>).
            </Typography>
          </StepContainer>

          <StepContainer>
            <StepNumber>3</StepNumber>
            <Typography align={"left"} variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              Минимальная сумма заказа — указана к корзине.
            </Typography>
          </StepContainer>

          <StepContainer>
            <StepNumber>4</StepNumber>
            <Typography align={"left"} variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              При подтверждении укажите контакты — мы свяжемся для уточнения деталей.
            </Typography>
          </StepContainer>

          <StepContainer>
            <StepNumber>5</StepNumber>
            <Typography align={"left"} variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              Рекомендуем сохранить заказ в PDF перед отправкой.
            </Typography>
          </StepContainer>

          {/* Оплата */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, mt: 4 }}>
            Оплата
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              <RussiaFlag />
              <strong>Россия:</strong> Сбербанк, наличные, оплата через Avito (если доставка avito).
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              <img style={{height: "25px", width: "25px", marginRight: "8px"}} src={belarusFlag} alt="belarus" />
              <strong>Беларусь:</strong> наличные, наложенный платеж (Европочта/Почта РБ).
            </Typography>
          </Box>

          {/* Доставка */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Доставка
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              <RussiaFlag />
              <strong>Россия:</strong> только через Avito (выбирайте удобный вариант).
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              <img style={{height: "25px", width: "25px", marginRight: "8px"}} src={belarusFlag} alt="belarus" />
              <strong>Беларусь:</strong> Почта РБ, Европочта.
            </Typography>
          </Box>

          {/* Обмен */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Обмен
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start', alignItems: "center" }}>
            <label className="custom-checkbox">
              <input type="checkbox" checked={true} />
              <span className="checkmark"></span>
            </label>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              Возможен в течение 14 дней после получения, если сохранен товарный вид.
            </Typography>
          </Box>

          {/* Поддержка */}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Поддержка
          </Typography>

          <SupportItem>
            <img style={{height: "25px", marginRight: "8px"}} src={telegram_icon} alt="telegram_icon" />
            <Typography variant="body1" sx={{ color: '#555' }}>
              <a href="https://t.me/tatsiana_pr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0088cc' }}>
                @tatsiana_pr
              </a>
            </Typography>
          </SupportItem>

          <SupportItem>
            {getSvg('mail')}
            <Typography variant="body1" sx={{ color: '#555' }}>
              Почта: <a href="mailto:legobricks2025@gmail.com" style={{ textDecoration: 'none', color: '#0088cc' }}>
                legobricks2025@gmail.com
              </a>
            </Typography>
          </SupportItem>

        </ContentContainer>
      </StyledBox>
    </>
  );
}