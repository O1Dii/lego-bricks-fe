import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation/Navigation";


export default function Conditions() {

  return (
    <>
      <Navigation>
      </Navigation>
      <Box className={"main-page-content"}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{padding: "20px"}}>
            <Typography variant="h4" align="left" gutterBottom>
              <strong>
                Условия покупки
              </strong>
            </Typography>
            <Typography align="left" gutterBottom>
              <p><strong>Добро пожаловать!</strong> Здесь вы можете собрать заказ из нужных деталей.</p>

              <h3>1. Оформление заказа</h3>
              <ul>
                <li>Загрузите Wanted List с BrickLink — система автоматически добавит только доступные детали из вашего списка.</li>
                <li>Или выбирайте детали вручную через каталог или поиск (по номеру, например, <em>3005</em>).</li>
                <li>Минимальная сумма заказа — указана к корзине.</li>
                <li>При подтверждении укажите контакты — мы свяжемся для уточнения деталей.</li>
                <li>Рекомендуем сохранить заказ в PDF перед отправкой.</li>
              </ul>

              <h3>2. Оплата</h3>
              <ul>
                <li><strong>Россия:</strong> Сбербанк, наличные, оплата через Avito (если доставка avito).</li>
                <li><strong>Беларусь:</strong> наличные, наложенный платеж (Европочта/Почта РБ).</li>
              </ul>

              <h3>3. Доставка</h3>
              <ul>
                <li><strong>Россия:</strong> только через Avito (выбирайте удобный вариант).</li>
                <li><strong>Беларусь:</strong> Почта РБ, Европочта.</li>
              </ul>

              <h3>4. Обмен</h3>
              <ul>
                <li>Возможен в течение 14 дней после получения, если сохранен товарный вид.</li>
              </ul>

              <h3>5. Поддержка</h3>
              <ul>
                <li>Telegram: <a href="https://t.me/tatsiana_pr" target="_blank">@tatsiana_pr</a></li>
                <li>Почта: <a href="mailto:legobricks2025@gmail.com">legobricks2025@gmail.com</a></li>
              </ul>

              <p><strong>Приятных покупок!</strong></p>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
