var dataTugas = [
    {
        id: 1,
        kursus: "Pemrograman Web",
        nama: "Tugas 2: Form HTML dan Validasi",
        deadline: "30 September 2026",
        status: "Belum Dikerjakan"
    },
    {
        id: 2,
        kursus: "Pemrograman Mobile",
        nama: "Tugas 1: Desain Antarmuka Mobile",
        deadline: "5 Oktober 2026",
        status: "Sedang Dikerjakan"
    },
    {
        id: 3,
        kursus: "Basis Data",
        nama: "Tugas 3: ERD dan Normalisasi",
        deadline: "12 Oktober 2026",
        status: "Belum Dikerjakan"
    }
];

function hitungTugasBelumSelesai() {
    var total = 0;
    for (var i = 0; i < dataTugas.length; i++) {
        if (dataTugas[i].status != "Selesai") {
            total++;
        }
    }
    return total;
}

function filterDataTugas(status) {
    if (status == "Semua") {
        return dataTugas;
    }
    var hasil = [];
    for (var i = 0; i < dataTugas.length; i++) {
        if (dataTugas[i].status == status) {
            hasil.push(dataTugas[i]);
        }
    }
    return hasil;
}

function renderTabel(list) {
    var tabel = document.getElementById("tabel-tugas");
    if (!tabel) {
        return;
    }
    tabel.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        var tr = document.createElement("tr");

        var warna = "black";
        if (list[i].status == "Belum Dikerjakan") {
            warna = "red";
        } else if (list[i].status == "Sedang Dikerjakan") {
            warna = "orange";
        } else if (list[i].status == "Selesai") {
            warna = "green";
        }

        tr.innerHTML = "<td>" + list[i].kursus + "</td>" +
            "<td>" + list[i].nama + "</td>" +
            "<td>" + list[i].deadline + "</td>" +
            "<td style='font-weight: bold; color: " + warna + ";'>" + list[i].status + "</td>" +
            "<td><button class='btn-hapus' data-id='" + list[i].id + "' style='background-color: #e74c3c; padding: 5px 10px; font-size: 12px;'>Hapus</button></td>";

        tabel.appendChild(tr);
    }

    var ringkasan = document.getElementById("info-tugas-ringkasan");
    if (ringkasan) {
        ringkasan.innerHTML = "Total tugas: " + dataTugas.length + " | Tugas belum selesai: " + hitungTugasBelumSelesai();
    }
}

$(document).ready(function() {
    if ($("#tabel-tugas").length > 0) {
        renderTabel(dataTugas);
    }

    $("#btn-toggle-tambah").click(function() {
        $("#box-form-tambah").slideToggle();
    });

    $("#btn-batal-tambah").click(function() {
        $("#box-form-tambah").slideUp();
    });

    $("#form-tambah-tugas").on("submit", function(e) {
        e.preventDefault();
        var kursus = $("#input-kursus").val();
        var nama = $("#input-nama-tugas").val();
        var deadline = $("#input-deadline").val();
        var status = $("#input-status").val();

        if (kursus == "" || nama == "" || deadline == "") {
            alert("Semua data tugas wajib diisi!");
            return;
        }

        var tugasBaru = {
            id: new Date().getTime(),
            kursus: kursus,
            nama: nama,
            deadline: deadline,
            status: status
        };

        dataTugas.push(tugasBaru);

        var statusSekarang = $("#filter-status").val();
        renderTabel(filterDataTugas(statusSekarang));

        $("#input-kursus").val("");
        $("#input-nama-tugas").val("");
        $("#input-deadline").val("");
        $("#box-form-tambah").slideUp();

        $("#notif-box").text("Tugas baru berhasil ditambahkan!").slideDown().delay(2000).slideUp();
    });

    $(document).on("click", ".btn-hapus", function() {
        var id = $(this).attr("data-id");
        for (var i = 0; i < dataTugas.length; i++) {
            if (dataTugas[i].id == id) {
                dataTugas.splice(i, 1);
                break;
            }
        }
        var statusSekarang = $("#filter-status").val();
        renderTabel(filterDataTugas(statusSekarang));
        $("#notif-box").text("Tugas berhasil dihapus!").slideDown().delay(2000).slideUp();
    });

    $("#filter-status").on("change", function() {
        var status = $(this).val();
        var hasil = filterDataTugas(status);
        renderTabel(hasil);
    });

    $("#form-pengumpulan form").on("submit", function(e) {
        var judul = $("#judul-tugas").val();
        var file = $("#file-tugas").val();
        if (judul == "" || file == "") {
            e.preventDefault();
            alert("Harap lengkapi judul tugas dan pilih file!");
        } else {
            e.preventDefault();
            alert("Tugas berhasil dikumpulkan!");
            window.location.href = "dashboard.html";
        }
    });

    $("#login form").on("submit", function(e) {
        var email = $("#email").val();
        var pass = $("#password").val();
        var role = $("#role").val();
        if (email == "" || pass == "" || !role) {
            e.preventDefault();
            alert("Semua field login wajib diisi!");
        }
    });

    $("#btn-toggle-materi").click(function() {
        $("#list-materi").slideToggle();
    });
});
