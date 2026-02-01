const BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
    const backBtn = document.getElementById("backBtn");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const imageInput = document.getElementById("imageInput");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    
    const helperText = document.getElementById("helperText");
    const submitBtn = document.getElementById("submitBtn");
    
    const headerProfileIcon = document.getElementById("headerProfileIcon");
    const headerDropdown = document.getElementById("headerDropdown");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "posts.html";
        return;
    }

    // 기존 데이터 불러오기 (GET)
    async function loadPostData() {
        try {
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error("데이터 로딩 실패");

            const post = await response.json();

            titleInput.value = post.title;
            contentInput.value = post.content;
            
            if (post.image) {
                fileNameDisplay.textContent = "기존 이미지가 유지됩니다 (변경하려면 클릭)";
            }

            if (!post.is_owner) {
                alert("수정 권한이 없습니다.");
                window.location.href = `post_detail.html?id=${postId}`;
            }

        } catch (error) {
            console.error("Load Error:", error);
            alert("게시글 정보를 불러오는데 실패했습니다.");
            window.location.href = "posts.html";
        }
    }

    loadPostData();

    // 기능 로직 (드롭다운, 파일선택, 뒤로가기)
    
    // 드롭다운
    if (headerProfileIcon && headerDropdown) {
        headerProfileIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            headerDropdown.classList.toggle("hidden");
        });
        document.addEventListener("click", (e) => {
            if (!headerProfileIcon.contains(e.target) && !headerDropdown.contains(e.target)) {
                headerDropdown.classList.add("hidden");
            }
        });
    }

    // 뒤로가기
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = `post_detail.html?id=${postId}`;
        });
    }

    // 파일 선택 시 이름 표시
    imageInput.addEventListener("change", () => {
        if (imageInput.files.length > 0) {
            fileNameDisplay.textContent = imageInput.files[0].name;
        } else {
            fileNameDisplay.textContent = "선택된 파일 없음";
        }
    });

    // 제목/내용 입력 시 에러 메시지 삭제
    const clearError = () => { helperText.textContent = ""; };
    titleInput.addEventListener("input", clearError);
    contentInput.addEventListener("input", clearError);

    // 수정 완료 요청 (PUT)
    submitBtn.addEventListener("click", async () => {
        const titleValue = titleInput.value.trim();
        const contentValue = contentInput.value.trim();
        const imageFile = imageInput.files[0];

        // 유효성 검사
        if (titleValue === "" || contentValue === "") {
            helperText.textContent = "*제목, 내용을 모두 작성해주세요";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "수정 중...";

        // FormData 생성
        const formData = new FormData();
        formData.append("title", titleValue);
        formData.append("content", contentValue);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                alert("게시글이 수정되었습니다!");
                window.location.href = `post_detail.html?id=${postId}`;
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "수정에 실패했습니다.");
            
                submitBtn.disabled = false;
                submitBtn.textContent = "수정하기";
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("서버 연결에 실패했습니다.");

            submitBtn.disabled = false;
            submitBtn.textContent = "수정하기";
        }
    });
});