도메인 중심의 계층형 구조 (Layered Architecture) 를 사용하세요.

- Persistence/Repository: 데이터 접근 로직 (JPA 엔티티, 어댑터 등)
- Service/Domain: 순수 비즈니스 로직
- ViewModel/State: UI 상태 관리
- DTO/Model: 데이터 전송 객체 및 모델 분리

React (MVVM)
Spring (MVC)
